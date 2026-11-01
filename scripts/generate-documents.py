"""Generate concise bilingual summaries from the supplied six-image product material.
Run: node scripts/export-data.mjs | python3 scripts/generate-documents.py
"""
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4

content=json.load(sys.stdin)
out=Path(__file__).resolve().parents[1]/'public'/'downloads'
out.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
for lang in ['zh','en']:
    zh=lang=='zh'
    font='STSong-Light' if zh else 'Helvetica'
    def p(text,size=10,color='#4f6251',leading=None):
        text=text.replace('·','/').replace('×','x').replace('–','-').replace('—','-').replace('’',"'")
        return Paragraph(escape(text),ParagraphStyle('body',fontName=font,fontSize=size,leading=leading or size*1.65,textColor=HexColor(color),wordWrap='CJK'))
    doc=SimpleDocTemplate(str(out/f'Therma-Clear-{lang}.pdf'),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=38,bottomMargin=45,title='Therma Clear / Product Summary',author=content['company']['englishName'])
    flow=[p(content['company']['name'][lang],13,'#252b2b'),p(content['company']['englishName'] if zh else content['company']['name']['zh'],8),Spacer(1,22),p('Therma Clear',29,'#252b2b'),p('透明防火材料 / 产品资料摘要' if zh else 'Transparent Fireproof Material / Product Summary',12),Spacer(1,14),p(content['company']['introduction'][lang]),Spacer(1,18)]
    for feature in content['features']:
        flow.extend([p(feature['title'][lang],12,'#252b2b'),p(feature['description'][lang],9),Spacer(1,9)])
    flow.append(Spacer(1,6))
    headers=['性能指标','资料数值','基材或说明'] if zh else ['Property','Reported value','Material or context']
    rows=[[p(x,8,'#252b2b') for x in headers]]
    for row in content['technicalData']:
        rows.append([p(row['label'][lang],8),p(row['value'],10,'#252b2b'),p(row['condition'][lang],8)])
    table=Table(rows,colWidths=[190,90,231],hAlign='LEFT')
    table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#e9eee1')),('BACKGROUND',(0,1),(-1,-1),HexColor('#f7f9f3')),('LINEBELOW',(0,0),(-1,-1),.5,HexColor('#d3ddcb')),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
    flow.extend([table,Spacer(1,16),p(('适用基材：' if zh else 'Substrates: ')+(' / '.join(x[lang] for x in content['materials'])),9),p(('应用方向：' if zh else 'Application areas: ')+(' / '.join(x['title'][lang] for x in content['applications'])),9),Spacer(1,12),p(content['sourceNote'][lang],8),p('数值来源：产品图文 3、4。本摘要为图文内容整理，不是独立检测报告。' if zh else 'Numerical sources: product images 3 and 4. This summary condenses the supplied materials; it is not an independent test report.',8)])
    def footer(canvas,doc):
        canvas.setStrokeColor(HexColor('#d3ddcb'));canvas.line(42,33,553,33)
        canvas.setFont('Helvetica',7);canvas.setFillColor(HexColor('#52664b'));canvas.drawString(42,21,'ADVANCED COMPOSITES STUDIO LIMITED / THERMA CLEAR');canvas.drawRightString(553,21,str(doc.page))
    doc.build(flow,onFirstPage=footer,onLaterPages=footer)
print('Generated 2 bilingual Therma Clear product summaries from the shared website data.')
