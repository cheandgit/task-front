// Пока не работает!
export const CustomTheme = {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
      { token: 'keyword', foreground: '00ff00' },
      { token: 'identifier', foreground: '00f' },
      // Add more rules as needed
    ],
    colors: {
      'editor.foreground': '#F8F8F8',
      'editor.background': '#2E3440',
      'editor.selectionBackground': '#DDF0FF33',
      'editor.lineHighlightBackground': '#FFFFFF08',
      'editorCursor.foreground': '#A7A7A7',
      'editorWhitespace.foreground': '#BFBFBF',
      // Add more colors as needed
    }
  };
  