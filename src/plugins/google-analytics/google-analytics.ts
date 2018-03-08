import { Transformer } from '../../transform'

export const insertGA = (UA: string): Transformer => {
  return async ($: CheerioStatic) => {
    $('head').append(`
      <script async src="https://www.googletagmanager.com/gtag/js?id=${UA}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${UA}');
      </script>
    `)
  }
}
