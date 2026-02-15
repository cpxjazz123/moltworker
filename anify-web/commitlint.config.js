/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-empty': [2, 'always'],
    'footer-empty': [2, 'always'],
    'subject-case': [2, 'always', ['sentence-case']],
    'no-chinese': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'no-chinese': ({ header, body, footer }) => {
          const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/
          const texts = [header, body, footer].filter(Boolean)
          const hasChinese = texts.some((text) => chineseRegex.test(text))
          return [
            !hasChinese,
            'Commit message must not contain Chinese characters',
          ]
        },
      },
    },
  ],
}
