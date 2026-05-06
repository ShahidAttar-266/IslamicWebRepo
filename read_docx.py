import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            xml_content = z.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        # The namespace for Word XML
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in tree.findall('.//w:p', ns):
            texts = []
            for t in p.findall('.//w:t', ns):
                if t.text:
                    texts.append(t.text)
            if texts:
                paragraphs.append(''.join(texts))
        
        for p in paragraphs:
            print(p)
    except Exception as e:
        print(f"Error reading docx: {e}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        read_docx(sys.argv[1])
    else:
        print("Please provide a file path")