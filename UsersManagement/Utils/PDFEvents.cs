using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BO.ViewModel;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace UsersManagement.Utils
{
    public class PDFEvents : PdfPageEventHelper
    {
        // This is the contentbyte object of the writer  
        PdfContentByte cb;

        // we will put the final number of pages in a template  
        PdfTemplate headerTemplate;

        // this is the BaseFont we are going to use for the header / footer  
        BaseFont bf = null;

        // This keeps track of the creation time  
        DateTime PrintTime = DateTime.Now;

        string DateFormated;
        readonly EmpresaViewModel Empresa;
        readonly Image HeaderLogo;
        readonly string HeaderTitle;
        readonly string AditionalFooter;

        #region Fields  
        private string _header;
        #endregion

        #region Properties  
        public string Header
        {
            get { return _header; }
            set { _header = value; }
        }
        #endregion


        public PDFEvents(EmpresaViewModel empresa, Image headerLogo, string headerTitle, string aditionalFooter = null)
        {
            Empresa = empresa;
            HeaderLogo = headerLogo;
            HeaderTitle = headerTitle;
            AditionalFooter = aditionalFooter;
        }

        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            try
            {
                PrintTime = DateTime.Now;
                DateFormated = PrintTime.ToString("dd/MM/yyyy");
                bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                cb = writer.DirectContent;
                headerTemplate = cb.CreateTemplate(100, 100);
            }
            catch (DocumentException de)
            {
            }
            catch (System.IO.IOException ioe)
            {
            }
        }

        public override void OnEndPage(PdfWriter writer, Document document)
        {
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.HorizontalAlignment = Element.ALIGN_LEFT;
            headerTable.SetWidths(new int[] { 90, 150 });

            PdfPCell logoCell = new PdfPCell(HeaderLogo, true)
            {
                BorderWidth = 0,
                Padding = 12f
            };

            Paragraph infoP = new Paragraph();
            infoP.SetLeading(12f, 0f);

            Font nameFont = new Font(Font.FontFamily.HELVETICA, 15, Font.BOLD);
            Font regularFont = new Font(Font.FontFamily.HELVETICA, 12);
            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD);

            Chunk name = new Chunk(Empresa.nombre_comercial, nameFont);
            Chunk rfc = new Chunk(Empresa.razon_social, regularFont);
            Chunk address1 = new Chunk("");
            Chunk address2 = new Chunk("");
            Chunk telMail = new Chunk(Empresa.telefono);

            infoP.Add(name);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(rfc);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(address1);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(address2);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(telMail);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(Chunk.NEWLINE);
            infoP.Add(new Chunk(HeaderTitle, titleFont));

            infoP.Alignment = Element.ALIGN_CENTER;

            PdfPCell infoCell = new PdfPCell
            {
                Border = 0,
                PaddingTop = 12f
            };
            infoCell.AddElement(infoP);

            headerTable.AddCell(logoCell);
            headerTable.AddCell(infoCell);

            //headerTable.TotalWidth = document.PageSize.Width - 350f;
            headerTable.TotalWidth = 450f;
            headerTable.WidthPercentage = 100;

            headerTable.WriteSelectedRows(0, -1, 10f, document.PageSize.Height - 5f, writer.DirectContent);

            string text = "Página " + writer.PageNumber + " de ";

            {
                cb.BeginText();
                cb.SetFontAndSize(bf, 8);
                cb.SetTextMatrix(document.PageSize.GetLeft(450), document.PageSize.GetTop(100));
                cb.ShowText(text);
                cb.EndText();
                float len = bf.GetWidthPoint(text, 8);
                //Adds "12" in Page 1 of 12  
                cb.AddTemplate(headerTemplate, document.PageSize.GetLeft(450) + len, document.PageSize.GetTop(100));
            }

            {
                if (!string.IsNullOrEmpty(AditionalFooter))
                {
                    string[] lines = AditionalFooter.Split(new string[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);

                    if (lines.Length > 1)
                    {
                        var lineHeigth = 12;
                        var startPosY = lineHeigth * lines.Length;

                        foreach (var line in lines)
                        {
                            cb.BeginText();
                            cb.SetFontAndSize(bf, 9);
                            cb.SetTextMatrix(20f, document.PageSize.GetBottom(30 + startPosY));
                            cb.ShowText(line);
                            cb.EndText();

                            startPosY -= lineHeigth;
                        }
                    }
                    else
                    {
                        cb.BeginText();
                        cb.SetFontAndSize(bf, 9);
                        cb.SetTextMatrix(20f, document.PageSize.GetBottom(30));
                        cb.ShowText(AditionalFooter);
                        cb.EndText();
                    }
                }

                cb.BeginText();
                cb.SetFontAndSize(bf, 9);
                cb.SetTextMatrix(20f, document.PageSize.GetBottom(27));
                cb.ShowText(DateFormated);
                cb.EndText();
            }
        }

        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);

            headerTemplate.BeginText();
            headerTemplate.SetFontAndSize(bf, 8);
            headerTemplate.SetTextMatrix(0, 0);
            headerTemplate.ShowText((writer.PageNumber).ToString());
            headerTemplate.EndText();
        }
    }
}