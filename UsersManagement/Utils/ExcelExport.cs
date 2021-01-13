using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using ClosedXML.Excel;

namespace UsersManagement.Utils
{
    /// <summary>
    /// Helper para exportar archivos excel,
    /// Verificar los metodos con manejo de excepciones
    /// </summary>
    public static class ExcelExport
    {
        /// <summary>
        /// MemoryStream que contiene un archivo Excel,
        /// contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        /// ExcelExtension: xlsx
        /// </summary>
        /// <param name="dataTable">Datatable a exportar</param>
        /// <returns></returns>
        public static MemoryStream ExportDatatable(DataTable dataTable)
        {
            var memoryStream = new MemoryStream();
            var workBook = new XLWorkbook();
            var workSheet = workBook.AddWorksheet(dataTable, "Hoja1");
            workBook.SaveAs(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }

        /// <summary>
        /// MemoryStream que contiene un archivo Excel,
        /// contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        /// ExcelExtension: xlsx
        /// </summary>
        /// <typeparam name="T">Objeto iterado en la lista</typeparam>
        /// <param name="list">Lista a exportar</param>
        /// <param name="Columns">Columnas de la lista</param>
        /// <param name="indices">Indices de la lista</param>
        /// <returns></returns>
        public static MemoryStream ExportList<T>(this IList<T> list, List<string> Columns, List<int> indices)
        {
            DataTable dataTable = ToDataTable(list, Columns, indices);
            var memoryStream = new MemoryStream();
            var workBook = new XLWorkbook();
            var workSheet = workBook.AddWorksheet(dataTable, "Hoja1");
            workBook.SaveAs(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }

        /// <summary>
        /// Datatable con las columnas e indices espesificados de la lista
        /// </summary>
        /// <typeparam name="T">Objeto iterado en la lista</typeparam>
        /// <param name="data">Lista a convertir</param>
        /// <param name="Columns">Columnas de la tabla</param>
        /// <param name="indices">Indices de la tabla</param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(this IList<T> data, List<string> Columns, List<int> indices)
        {
            PropertyDescriptorCollection props =
                TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (var name in Columns)
            {
                table.Columns.Add(name);
            }

            object[] values = new object[table.Columns.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < props.Count; i++)
                {
                    if (indices.Contains(i))
                    {
                        values[indices.IndexOf(i)] = props[i].GetValue(item);
                    }
                }
                table.Rows.Add(values);
            }
            return table;
        }
    }
}