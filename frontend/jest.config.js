export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@\/(.*)$': '<rootDir>/src/$1',
    '^.+\\.[css|scss|sass]+$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/']
}
