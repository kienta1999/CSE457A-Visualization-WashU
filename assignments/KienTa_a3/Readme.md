<h2>I did use external work</h2>
<ul>
  <li>https://www.jasondavies.com/wordcloud/</li>

  <li>https://www.geeksforgeeks.org/removing-stop-words-nltk-python/</li>
  <li>
    https://github.com/jasondavies/d3-cloud/blob/master/examples/browserify.js
  </li>
</ul>

<h2>Guide to run my python file</h2>
<p>Make sure you have nltk, BeautifulSoup installed before running the code</p>
<p>
  BeautifulSoup is used to parse html content, and nltk is used to process words
</p>
<p>
  I first get the content of each story, remove the punctuation and stop words, count the word frequency, and then
  calculate the cosine similarity between stories for visualization purpose.
</p>
<p>
  Run <strong>python3 data_preprocess.py</strong> to build json file. The file
  is saved as <strong>processed_englishfairytales_copy.json</strong> to avoid
  overwriting my main file data in <strong> processed_englishfairytales.json</strong> just to make
  sure the visualization still works (in case something wrong happen). If you
  follow my instruction correctly, the the content of these 2 files should be
  the same.
</p>
