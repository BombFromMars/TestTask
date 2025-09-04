import { PlaywrightTestConfig } from '@playwright/test'


const config: PlaywrightTestConfig = {
    expect: {
        toMatchSnapshot: { threshold: 0.1 }
    },

    // reporter: env.REPORTERS.map(reporter => reporters[reporter]),

    workers: 8,

    // retries: 3,

    // repeatEach: 10,

    use: {
        headless: false,
        viewport: { width: 1600, height: 900 },
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },

    projects: [
        {
            name: 'Chromium',
            use: {
                browserName: 'chromium',
                locale: 'en-GB'
            }
        }
    ]
}

export default config
