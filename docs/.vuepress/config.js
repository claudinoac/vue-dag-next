module.exports = {
  title: "Vue DAG",
  base: "/",
  serviceWorker: true,
  themeConfig: {
    repo: "AlexImb/vue-dag",
    docsDir: "docs",
    editLinks: true,
    serviceWorker: {
      updatePopup: true
    },
    navbar: [
      {
        text: "Home",
        link: "/"
      },
      {
        text: "Guide",
        link: "/guide/installation"
      },
      {
        text: "API",
        link: "/api/"
      },
      {
        text: "Demo",
        link: "https://vue-dag-example.netlify.app"
      }
    ],
    sidebarDepth: "2,",
    sidebar: [
      {
        text: "Guide",
        children: [
            { text: 'Installation', link: '/guide/installation' }
        ]
      },
      {
        text: "API",
        children: [
            {
                text: 'Props',
                link: '/api/props',
            },
            {
                text: 'Events',
                link: '/api/events',
            },
            {
                text: 'Slots',
                link: '/api/slots',
            },
        ]
      }
    ]
  }
}
