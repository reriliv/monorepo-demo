import { useEffect, useRef } from 'react';

const Home = () => {
  const abortController = useRef<AbortController | null>(null);
  const promptRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const request = async () => {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      // return response;
      console.log('response', response);
    };

    request();
  }, []);

  const startStream = async () => {
    const prompt = promptRef.current!.value;
    const sessionId = 'session-123'; // 可以通过生成 UUID 来区分不同会话
    // const output = document.getElementById('output');
    outputRef.current!.innerHTML = '';

    abortController.current = new AbortController();

    try {
      const response = await fetch('/api/conversation/chatStream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sessionId }),
        signal: abortController.current.signal
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将二进制数据转为文本，并按 SSE 格式拆分
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));
            if (data.type === 'text') {
              outputRef.current!.innerHTML += data.content;
              window.scrollTo(0, document.body.scrollHeight);
            } else if (data.type === 'tool_call') {
              const toolDiv = document.createElement('div');
              toolDiv.className = 'tool';
              toolDiv.innerText = `[执行工具]: ${data.content.name}(${JSON.stringify(data.content.args)})`;
              outputRef.current!.appendChild(toolDiv);
            } else if (data.type === 'error') {
              outputRef.current!.innerHTML += `\n[错误]: ${data.content}`;
            }
          }
        }
      }

    } catch (error) {
      if ((error as Error).name === 'AbortError') console.log('中断请求');
      else console.error(error);
    }
  };

  const stopStream = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  };

  return (
    <div>
      <input type="text" ref={promptRef} value="帮我读取 apps/api/package.json 文件" style={{ width: 300 }} />
      <button onClick={startStream}>发送请求</button>
      <button onClick={stopStream}>中断</button>

      <div ref={outputRef}></div>
    </div>
  );
};

export default Home;
