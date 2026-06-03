import sys
import io
import pdfplumber

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

path = sys.argv[1]
with pdfplumber.open(path) as pdf:
    for i, page in enumerate(pdf.pages, 1):
        print(f"\n--- Page {i} ---\n")
        text = page.extract_text()
        if text:
            print(text)
