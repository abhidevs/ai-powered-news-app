import React, { useEffect, useState } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web'
import wordsToNumbers from 'words-to-numbers'
import NewsCards from './components/NewsCards/NewsCards'
import useStyles from './styles'

const alanKey = '59bf5eb397d0de10ea08b0e0423d8abf2e956eca572e1d8b807a3e2338fdd0dc/stage'

const App = () => {
    const [newsArticles, setNewsArticles] = useState([])
    const [activeArticle, setActiveArticle] = useState(-1)
    const classes = useStyles()

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    // console.log(articles);
                    setNewsArticles(articles);
                    setActiveArticle(-1)
                } else if(command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1)
                } else if(command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number
                    const article = articles[parsedNumber - 1]

                    if(parsedNumber > 20) {
                        alanBtn().playText('please try that again.')
                    } else if(article) {
                        window.open(article.url, '_blank')
                        alanBtn().playText(`Opening article number ${parsedNumber}`)
                    }
                }
            }
        })
    }, [])

    return (
        <div>
            <div className={classes.logoContainer}>
                <img className={classes.alanLogo} src="https://voicebot.ai/wp-content/uploads/2019/10/alan.jpg" alt="alan logo"/>
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    )
}

export default App
