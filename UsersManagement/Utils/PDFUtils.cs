using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsersManagement.Utils
{
    public static class PDFUtils
    {
        public static PdfPTable BuildTableBody(IEnumerable<string> headers, IEnumerable<IEnumerable<string>> rowsData, int[] columnsWidths = null)
        {
            int headersCount = headers.Count();

            PdfPTable mainTable = new PdfPTable(headersCount)
            {
                WidthPercentage = 100,
                HeaderRows = 1
            };

            if (columnsWidths != null)
            {
                mainTable.SetWidths(columnsWidths);
            }

            Font headerFont = new Font(Font.FontFamily.HELVETICA, 8, Font.BOLD, BaseColor.WHITE);
            Font subHeaderFont = new Font(Font.FontFamily.HELVETICA, 9, Font.BOLD);
            Font regularFont = new Font(Font.FontFamily.HELVETICA, 10);
            BaseColor headerColor = new BaseColor(0, 0, 0);

            foreach (var header in headers)
            {
                PdfPCell tHeader = new PdfPCell(new Phrase(header, headerFont))
                {
                    BackgroundColor = headerColor,
                    Border = 0
                };

                mainTable.AddCell(tHeader);
            }

            for (int i = 0; i < rowsData.Count(); i++)
            {
                var rowData = rowsData.ElementAt(i);

                if (rowData.Count() == 1)
                {
                    var cellData = rowData.First();
                    PdfPCell subheaderCell = new PdfPCell(new Phrase(cellData, subHeaderFont))
                    {
                        Border = 0,
                        BorderWidthBottom = 1.5f,
                        PaddingBottom = 5f,
                        Colspan = headersCount
                    };
                    mainTable.AddCell(subheaderCell);
                }
                else
                {
                    for (int x = 0; x < headersCount; x++)
                    {
                        var cellData = rowData.ElementAt(x);
                        PdfPCell dataCell = new PdfPCell(new Phrase(cellData, regularFont))
                        {
                            Border = 0,
                            PaddingBottom = 5f
                        };

                        mainTable.AddCell(dataCell);
                    }
                }

            }

            return mainTable;
        }

    }
}