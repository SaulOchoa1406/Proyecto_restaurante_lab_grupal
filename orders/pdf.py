from io import BytesIO

from django.utils import timezone
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


def generate_ticket_pdf(order):

    buffer = BytesIO()
    width, height = A5
    p = canvas.Canvas(buffer, pagesize=A5)

    p.setFont("Helvetica-Bold", 14)
    p.drawCentredString(width / 2, height - 20 * mm, "RESTAURANTE")
    p.setFont("Helvetica", 9)
    p.drawCentredString(width / 2, height - 26 * mm, "RUC: 20000000001")
    p.drawCentredString(width / 2, height - 31 * mm, "Arequipa, Perú")

    y = height - 45 * mm
    p.setFont("Helvetica", 10)

    local_date = timezone.localtime(order.date)

    p.drawString(15 * mm, y, f"Boleta N°: {order.id:06d}")
    y -= 6 * mm
    p.drawString(15 * mm, y, f"Fecha: {local_date.strftime('%d/%m/%Y %H:%M')}")
    y -= 6 * mm
    p.drawString(15 * mm, y, f"Mesa: {order.mesa.numero}")
    y -= 6 * mm
    p.drawString(15 * mm, y, f"Atendido por: {order.mozo.get_full_name() or order.mozo.username}")
    y -= 6 * mm

    if order.customer_name:
        p.drawString(15 * mm, y, f"Cliente: {order.customer_name}")
        y -= 6 * mm

    if order.customer_dni:
        p.drawString(15 * mm, y, f"DNI: {order.customer_dni}")
        y -= 6 * mm

    y -= 4 * mm
    p.line(15 * mm, y, width - 15 * mm, y)
    y -= 6 * mm

    p.setFont("Helvetica-Bold", 9)
    p.drawString(15 * mm, y, "Cant.")
    p.drawString(30 * mm, y, "Producto")
    p.drawRightString(width - 32 * mm, y, "P.Unit")
    p.drawRightString(width - 15 * mm, y, "Subtotal")
    y -= 5 * mm
    p.line(15 * mm, y, width - 15 * mm, y)
    y -= 6 * mm

    p.setFont("Helvetica", 9)

    for detail in order.details.all():

        if y < 30 * mm:
            p.showPage()
            y = width - 20 * mm
            p.setFont("Helvetica", 9)

        p.drawString(15 * mm, y, str(detail.cantidad))
        p.drawString(30 * mm, y, detail.producto.nombre[:28])
        p.drawRightString(width - 32 * mm, y, f"S/ {detail.precio_unitario:.2f}")
        p.drawRightString(width - 15 * mm, y, f"S/ {detail.subtotal:.2f}")
        y -= 6 * mm

    y -= 2 * mm
    p.line(15 * mm, y, width - 15 * mm, y)
    y -= 10 * mm

    p.setFont("Helvetica-Bold", 12)
    p.drawRightString(width - 15 * mm, y, f"TOTAL: S/ {order.total:.2f}")
    y -= 12 * mm

    p.setFont("Helvetica-Oblique", 8)
    p.drawCentredString(width / 2, y, "¡Gracias por su visita!")

    p.showPage()
    p.save()
    buffer.seek(0)

    return buffer