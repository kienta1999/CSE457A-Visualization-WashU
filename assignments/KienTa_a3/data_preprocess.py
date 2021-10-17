
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from bs4 import BeautifulSoup
from collections import Counter
import json
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
wnl = WordNetLemmatizer()


def string_preprocess(input_str):
    punctuations = '''!()-[]{};:'"”“\,<>./?@#$%^&*_~\n'''
    ans = ""
    for char in input_str:
        if char == '\u2014':
            ans += ' '
        elif char not in punctuations:
            ans += char
    ans = ans.lower().strip()
    # Filter stopword
    word_tokens = word_tokenize(ans)
    filtered_sentence = [wnl.lemmatize(w) for w in word_tokens if not w.lower() in set(
        stopwords.words('english'))]
    return ' '.join(filtered_sentence)


def str_to_freq(str):
    counter = Counter(str.split())
    ans = []
    for word in counter:
        ans.append({'word': word, 'frequency': counter[word]})
    return ans


def similarity_score(word_frequency1, word_frequency2):
    words = [word_freq['word'] for word_freq in word_frequency1]
    words.extend([word_freq['word'] for word_freq in word_frequency2])
    words = set(words)
    dot_product = 0
    dis1 = 0
    dis2 = 0
    for word in words:
        freq1 = list(filter(lambda x: (x['word'] == word), word_frequency1))
        freq1 = freq1[0]["frequency"] if freq1 else 0
        freq2 = list(filter(lambda x: (x['word'] == word), word_frequency2))
        freq2 = freq2[0]["frequency"] if freq2 else 0
        dot_product += freq1 * freq2
        dis1 += freq1 ** 2
        dis2 += freq2 ** 2
    return dot_product / ((dis1 * dis2) ** 0.5)


f = open('englishfairytales/englishfairytales.html', 'r')
soup = BeautifulSoup(f.read(), 'html.parser')

all_h2 = soup.body.find_all('h2')[3:-1]
title_and_content = []
for i, h2 in enumerate(all_h2):
    if i < len(all_h2) - 1:
        next_h2 = all_h2[i + 1]
        obj = {'title': h2.get_text().strip(), 'original_content': '', 'html': ''}
        itr = h2
        while itr != next_h2:
            itr = itr.next_sibling
            if itr.name == 'p':
                obj['html'] += f'<p>{itr.get_text()}</p>'
                obj['original_content'] += string_preprocess(itr.get_text())
        title_and_content.append(obj)
for element in title_and_content:
    element['word_frequency'] = str_to_freq(element['original_content'])

for element in title_and_content:
    element['similarity_score'] = []
    for element2 in title_and_content:
        if element != element2:
            score = similarity_score(
                element['word_frequency'], element2['word_frequency'])
            element['similarity_score'].append(
                {'title': element2["title"], 'score': score})
f = open("processed_englishfairytales_copy.json", "w")
f.write(json.dumps(title_and_content))
f.close()
