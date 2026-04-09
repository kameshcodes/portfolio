"""
Drop your new resume PDF into public/resume/ as Resume_Kamesh_Dubey.pdf,
then run:  python3 src/update_resume.py
"""
import os
import fitz  # PyMuPDF

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

pdf_path = "public/resume/Resume_Kamesh_Dubey.pdf"
img_path = "public/resume/resume.png"

doc = fitz.open(pdf_path)
page = doc[0]
pix = page.get_pixmap(dpi=400)
pix.save(img_path)
print(f"Done — saved {img_path} ({pix.width}x{pix.height})")
