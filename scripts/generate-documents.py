"""Regenerate bilingual concept PDFs and CSVs from the website's product data.
Run: node scripts/export-data.mjs | python3 scripts/generate-documents.py
Requires reportlab. No network or credentials used.
"""
import csv
import io
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

products = json.load(sys.stdin)
out = Path(__file__).resolve().parents[1] / 'public' / 'downloads'
out.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
ink, orange, muted, pale = [HexColor(x) for x in ['#272d29', '#e9562c', '#687361', '#eef0e7']]
for lang in ['zh', 'en']:
    zh = lang == 'zh'
    font = 'STSong-Light' if zh else 'Helvetica'
    styles = getSampleStyleSheet()
    for name, size, leading, color in [('Brand', 13, 20, orange), ('Title2', 30, 42, ink), ('Sub', 15, 25, ink), ('Body2', 10, 18, muted), ('Note2', 9, 16, muted), ('Cell', 9, 16, ink)]:
        styles.add(ParagraphStyle(name, fontName=font, fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT, wordWrap='CJK'))
    def para(text, style='Body2'):
        text = text.replace('·', '/').replace('³', '^3').replace('²', '^2')
        return Paragraph(escape(text), styles[style])
    for p in products:
        filename = out / f"{p['id']}-{lang}.pdf"
        doc = SimpleDocTemplate(str(filename), pagesize=A4, topMargin=47, bottomMargin=42, leftMargin=44, rightMargin=44, title=f"{p['id']} Concept Technical Data Sheet", author='FIREPROOF MATERIALS — DEMO')
        flow = [para('防火材料 / FIREPROOF MATERIALS' if zh else 'FIREPROOF MATERIALS', 'Brand'), Spacer(1, 24), para(p['id'], 'Title2'), para(p['name'][lang], 'Sub'), Spacer(1, 12), para('示例产品技术资料 · 演示版本 1.0' if zh else 'CONCEPT TECHNICAL DATA SHEET · DEMO VERSION 1.0', 'Note2'), Spacer(1, 22), para(p['description'][lang]), Spacer(1, 22)]
        labels = ['耐火时间（示例）','干膜厚度（示例）','密度（示例）','理论用量（示例）','颜色'] if zh else ['Fire resistance (illustrative)', 'Dry film thickness (illustrative)', 'Density (illustrative)', 'Consumption (illustrative)', 'Finish']
        values = [f"{p['duration']} min", f"{p['thickness']} mm", f"{p['density']} g/cm³", f"{p['consumption']} kg/m²", p['color'][lang]]
        table = Table([[para(a,'Cell'), para(b,'Cell')] for a,b in zip(labels,values)], colWidths=[235,272], hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),pale),('LINEBELOW',(0,0),(-1,-1),.5,HexColor('#d8ddcf')),('LEFTPADDING',(0,0),(-1,-1),14),('RIGHTPADDING',(0,0),(-1,-1),14),('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),12)]))
        flow += [table, Spacer(1, 25), para('重要说明' if zh else 'IMPORTANT NOTES','Sub'), Spacer(1, 9)]
        notes = [
            '本文件为网站示例资料，不是制造商正式技术文件，所有性能数据均为虚构演示值，不构成认证、合规证明或工程承诺。',
            '耐火时间与涂层厚度不构成对应关系。实际选型必须依据有效检测报告、适用标准、构件截面、基材、环境及项目设计。',
            '实际施工前须取得正式施工说明和安全数据表，核实底漆、防火层与面漆的完整系统兼容性。',
            '产品图为原创概念包装插画，实际品牌、包装和参数须在公开发布前替换并核验。'
        ] if zh else [
            'This is a website concept document, not an official manufacturer data sheet. All performance figures are fictional examples, not certification, compliance evidence or engineering commitments.',
            'Fire resistance and film thickness are not directly interchangeable. Actual specification requires valid test reports, applicable standards, section factors, substrate, exposure and project design.',
            'Obtain official application instructions and safety data sheets before use. Verify the complete primer, fire coating and topcoat system.',
            'Product images are original concept packaging illustrations. Verify and replace brand, packaging and data before public launch.'
        ]
        for note in notes:
            flow += [para(note,'Note2'), Spacer(1,8)]
        def footer(canvas, doc):
            canvas.setStrokeColor(HexColor('#d8ddcf'));canvas.line(44,35,551,35)
            canvas.setFont('Helvetica',7);canvas.setFillColor(muted)
            canvas.drawString(44,23,'FIREPROOF MATERIALS / DEMO ONLY / NOT FOR ENGINEERING USE')
            canvas.drawRightString(551,23,f'{doc.page}')
        doc.build(flow,onFirstPage=footer,onLaterPages=footer)
    headers = ['型号','产品名称','基材','耐火时间示例(min)','干膜厚度示例(mm)','密度示例(g/cm³)','理论用量示例(kg/m²)','颜色','备注'] if zh else ['Model','Name','Substrate','Illustrative fire resistance (min)','Illustrative dry film thickness (mm)','Illustrative density (g/cm3)','Illustrative consumption (kg/m2)','Finish','Notes']
    with (out/f'product-comparison-{lang}.csv').open('w',encoding='utf-8-sig',newline='') as f:
        writer=csv.writer(f);writer.writerow(headers)
        for p in products:
            writer.writerow([p['id'],p['name'][lang],p['category'],p['duration'],p['thickness'],p['density'],p['consumption'],p['color'][lang],'仅供演示，不可用于工程设计或认证' if zh else 'Demo only. Not for engineering or certification.'])
print('Generated 8 concept PDFs and 2 comparison CSVs.')
