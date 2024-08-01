const presets = [
  '@babel/preset-react',
  [
    '@babel/preset-env',
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }
  ],
  '@babel/preset-typescript'
]
const plugins = ['@emotion']

export default { presets, plugins }
