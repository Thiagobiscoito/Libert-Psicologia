tailwind.config = {
  theme: {
    extend: {
      colors: {
        'azul-serena': '#4A90E2',
        'verde-equilibrio': '#76D7C4',
        'damasco-acolhedor': '#FAD7A0',
        'cinza-nevoa': '#ECF0F1',
        'ceu-noturno': '#34495E',
        'branco-puro': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'], // Lato para corpo do texto
        heading: ['Poppins', 'sans-serif'], // Poppins para Títulos
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'float': '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
      }
    }
  }
}
