import axios from 'axios'
import dateFns from 'date-fns'

const appID = '35GHA2-RU99LL7QEG'

export const search = async query => {
  const { data } = await axios.get(
    `https://us-central1-midyear-forest-147918.cloudfunctions.net/waproxy?query=how%20old%20is%20${query}&appid=${appID}`
  )

  return extractAnswer(checkForErrors(data))
}

const checkForErrors = data => {
  if (!data.queryresult || data.queryresult.error !== false)
    throw new Error('An error occurred querying Wolfram Alpha')

  return data.queryresult
}

const extractAnswer = data => {
  const result = data.pods.find(pod => pod.id === 'Result')
  if (!result) throw new Error('No result found.')

  const ageSubpod = result.subpods.find(
    sp => sp.plaintext.match(/(years|months|days)/gi) !== null
  )
  if (!ageSubpod) throw new Error('No WolframAlpha age subpod found.')

  return parseAge(ageSubpod.plaintext)
}

const parseAge = age => {
  const years = /(\d{1,}){1,} years/gi.exec(age)[1]
  const months = /(\d{1,}){1,} months/gi.exec(age)[1]
  const days = /(\d{1,}){1,} days/gi.exec(age)[1]

  const date = calculateDateFromAge(years, months, days)
  const birthday = calculateBrennensAge()

  const { isBefore, difference } = calculateDifference(date, birthday)

  return isBefore
    ? `${Math.abs(difference)} before Brennen`
    : `${difference} after Brennen`
}

const calculateBrennensAge = () => {
  const birthday = '1998-12-29'
  return new Date(birthday)
}

const calculateDateFromAge = (years, months, days) => {
  let date = new Date()

  if (days) date = dateFns.subDays(date, days)
  if (months) date = dateFns.subMonths(date, months)
  if (years) date = dateFns.subYears(date, years)

  return date
}

const calculateDifference = (date, birthday) => {
  return [
    {
      type: 'years',
      action: dateFns.differenceInYears
    },
    {
      type: 'months',
      action: dateFns.differenceInMonths
    },
    {
      type: 'weeks',
      action: dateFns.differenceInWeeks
    }
  ].reduce((acc, diffType) => {
    if (acc !== null) return acc

    const difference = diffType.action(date, birthday)

    if (difference !== 0) {
      const absolute = Math.abs(difference)
      acc =
        difference < 0
          ? { isBefore: true, difference: `${difference} ${diffType.type}` }
          : { isBefore: false, difference: `${difference} ${diffType.type}` }
    }

    return acc
  }, null)
}
