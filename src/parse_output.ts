import {promises as fs} from 'fs'
import core from '@actions/core'
import cheerio from 'cheerio'

export async function parseBenchmarkStats(resultsFile: string): Promise<void> {
  const output = await fs.readFile(resultsFile, 'utf8')
  const $ = cheerio.load(output)
  $('tbody').each((_, metric) => {
    if ($(metric).find('.metric').length) {
      $(metric)
        .find('tr')
        .each((_n, suite) => {
          const cols = $(suite).find('td')
          if (cols.length > 1) {
            core.debug('ok')
          }
        })
    }
  })
}
