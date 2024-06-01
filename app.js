// app.js

document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    // add img limition
    var renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        var out = '<img class="image" src="' + href + '" alt="' + text + '"';
         if (title) {
              out += ' title="' + title + '"';
            }
           out += '/>';
            return out;
    };
    renderer.code = function(code, language) {
        // 检查语言是否有效
        const validLang = !!(language && hljs.getLanguage(language));
    
        // 使用 highlight.js 高亮代码
        const highlighted = validLang ? hljs.highlight(language, code).value : hljs.highlightAuto(code).value;
    
        return `<pre><code class="hljs ${validLang ? language : ''}" style="background-color: #333; color: #fff;">${highlighted}</code></pre>\n`;
    };


    marked.setOptions({ renderer: renderer });
    // 监听 textarea 内容变化
    markdownInput.addEventListener('input', function() {
        const markdownText = markdownInput.value;
        localStorage.setItem('textareaContent', markdownText);
        const html = marked.parse(markdownText); 
        console.log(html);
        preview.innerHTML = html;
    });
    // 保存输入内容 && 初始化 textarea
    var savedText = localStorage.getItem('textareaContent');
    if (savedText) {
      document.getElementById('markdown-input').value = savedText;
    } else {
    // 初始化预览
    const initialMarkdown = `
# Welcome to the Markdown Editor!
This is a simple online Markdown editor. You can type your Markdown here and see the preview on the right.

## Some Markdown examples:

**Bold text**

*Italic text*

[Link to Example](http://example.com)

\`Inline code\`

\`\`\`
// Code block
function hello() {
    console.log("Hello, world!");
}
\`\`\`

- List item 1
- List item 2

> Blockquote

![Alt text](https://placehold.it/350x150)

**Enjoy editing!**
    `;
        markdownInput.value = initialMarkdown;
    }
    markdownInput.dispatchEvent(new Event('input'));
});

function exportFile() {
    const markdownText = document.getElementById('markdown-input').value;
    const blob = new Blob([markdownText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown.md';
    a.click();
    URL.revokeObjectURL(url);
}