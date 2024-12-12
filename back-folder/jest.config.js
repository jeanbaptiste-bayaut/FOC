export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest', // Utilise Babel pour transformer les fichiers JS
  },
  globals: {
    'babel-jest': {
      useESM: true, // Active les modules ECMAScript dans Jest
    },
  },
};
