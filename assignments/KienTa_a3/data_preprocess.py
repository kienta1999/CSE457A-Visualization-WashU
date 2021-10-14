from bs4 import BeautifulSoup
from collections import Counter
import json


def string_preprocess(input_str):
    punctuations = '''!()-[]{};:'"”“\,<>./?@#$%^&*_~\n'''
    ans = ""
    for char in input_str:
        if char not in punctuations:
            ans += char
    return ans.lower().strip()


def str_to_freq(str):
    counter = Counter(str.split())
    ans = []
    for word in counter:
        ans.append({'word': word, 'counter': counter[word]})
    return ans


f = open('englishfairytales/englishfairytales.html', 'r')
soup = BeautifulSoup(f.read(), 'html.parser')

all_h2 = soup.body.find_all('h2')[3:-1]
title_and_content = []
for i, h2 in enumerate(all_h2):
    if i < len(all_h2) - 1:
        next_h2 = all_h2[i + 1]
        obj = {'title': h2.get_text().strip(), 'original_content': ''}
        itr = h2
        while itr != next_h2:
            itr = itr.next_sibling
            if itr.name == 'p':
                obj['original_content'] += string_preprocess(itr.get_text())
        title_and_content.append(obj)
for element in title_and_content:
    element['word_frequency'] = str_to_freq(element['original_content'])
f = open("processed_englishfairytales.json", "w")
f.write(json.dumps(title_and_content))
f.close()
