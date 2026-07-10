window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#121214',
        'surface-container-low': '#17171a',
        primary: '#f2ca50',
        'on-primary': '#1f1a08',
        'on-background': '#f5f5dc',
        'on-surface': '#f5f5dc',
        'on-surface-variant': '#c8c2b2',
        'label-caps': '#f2ca50'
      },
      fontFamily: {
        'headline-md': ['Syne', 'sans-serif'],
        'body-md': ['Hanken Grotesk', 'sans-serif'],
        'label-caps': ['Space Mono', 'monospace']
      }
    }
  }
};
