using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;
using BO.BussinesObject;
using BO.ViewModel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using UsersManagement.Utils;

namespace UsersManagement.Controllers
{
    public class RequestsController : Controller
    {
        //objetos
        private RequestBO RequestObject = new RequestBO();

        // GET: Requests
        public ActionResult Index()
        {
            return View();
        }

        //Post: Requests/GetList
        [HttpPost]
        public JsonResult GetList(RequestViewModel model)
        {
            // TODO: Add insert logic here
            var list = RequestObject.GetList(model);

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetListBoss
        [HttpPost]
        public JsonResult GetListBoss(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();
            
            try
            {
                //obtiene el usuario logueado 
                if (User.Identity.Name != null)
                {                    
                    var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);
                    resp = RequestObject.GetListBoss(userId, model);
                }
                else
                {
                    resp.Success = false;
                    resp.Message = "Usuario no encontrado";
                }
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetListPetitioner
        [HttpPost]
        public JsonResult GetListPetitioner(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                //obtiene el usuario logueado 
                if (User.Identity.Name != null)
                {

                    var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);
                    resp = RequestObject.GetListPetitioner(userId, model);
                }
                else
                {
                    resp.Success = false;
                    resp.Message = "Usuario no encontrado";
                }
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetListAuthorize
        [HttpPost]
        public JsonResult GetListAuthorize(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                //obtiene el usuario logueado 
                if (User.Identity.Name != null)
                {

                    var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);
                    resp = RequestObject.GetListAuthorize(userId, model);
                }
                else
                {
                    resp.Success = false;
                    resp.Message = "Usuario no encontrado";
                }
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetListCopy
        [HttpPost]
        public JsonResult GetListCopy(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                //obtiene el usuario logueado 
                if (User.Identity.Name != null)
                {

                    var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);
                    resp = RequestObject.GetListCopy(userId, model);
                }
                else
                {
                    resp.Success = false;
                    resp.Message = "Usuario no encontrado";
                }
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetById
        [HttpPost]
        public JsonResult GetById(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {                
                resp = RequestObject.GetById(model.RequestId);               
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Create
        [HttpPost]
        public JsonResult Create(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Register(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Delete/5
        [HttpPost]
        public ActionResult Delete(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Delete(model.RequestId);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Update
        [HttpPost]
        public JsonResult Update(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Update(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Approve
        [HttpPost]
        public JsonResult Approve(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Approve(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Authorize
        [HttpPost]
        public JsonResult Authorize(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Authorize(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Requests/Deny
        [HttpPost]
        public JsonResult Deny(RequestViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = RequestObject.Deny(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        //POST: Requests/GetPDFReport
        [HttpPost]
        public FileContentResult GetPDFReport(RequestViewModel model)
        {
            Document doc = new Document(PageSize.A4.Rotate(), 10f, 10f, 140f, 55f);
            doc.AddTitle("Reporte de solicitudes");
            doc.AddCreator("SPU");
            MemoryStream stream = new MemoryStream();
            DataSet ds = new DataSet();
            EmpresaViewModel empresa = new EmpresaViewModel();
            try
            {

                PdfWriter pdfWriter = PdfWriter.GetInstance(doc, stream);
                pdfWriter.CloseStream = false;

                empresa.razon_social = "SISTEMAS EN PUNTO";
                empresa.nombre_comercial = "Administración de solicitudes";

                pdfWriter.PageEvent = new PDFEvents(empresa, null, "Reporte de solicitudes");
                doc.Open();

                string[] headers = new string[] {
                    "#",
                    "USUARIO",
                    "SOLICITUD",
                    "FECHA",
                    "STATUS",
                    "PREGUNTA 1",
                    "PREGUNTA 2",
                    "PREGUNTA 3",
                    "PREGUNTA 4",
                    "PREGUNTA 5"
                };

                int[] tableWidths = new int[] { 60, 60, 60, 60, 70, 80, 80, 80, 80, 80};

                IList<string[]> rowsData = new List<string[]>();

                var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);   
                var data = RequestObject.GetListCopy(userId, model);

                foreach (var item in data.Data.OfType<RequestViewModel>().ToList())
                {
                    var questions = item.QuestionsVM.ToList();

                    rowsData.Add(new string[] {
                        item.RequestId.ToString(),
                        item.UserName,
                        item.ConceptName.ToString(),
                        item.CreatedAt,
                        item.StatusName,
                        questions != null ? questions.ElementAtOrDefault(0) != null ? questions.ElementAtOrDefault(0).Text : string.Empty : string.Empty,
                        questions != null ? questions.ElementAtOrDefault(1) != null ? questions.ElementAtOrDefault(1).Text : string.Empty : string.Empty,
                        questions != null ? questions.ElementAtOrDefault(2) != null ? questions.ElementAtOrDefault(2).Text : string.Empty : string.Empty,
                        questions != null ? questions.ElementAtOrDefault(3) != null ? questions.ElementAtOrDefault(3).Text : string.Empty : string.Empty,
                        questions != null ? questions.ElementAtOrDefault(4) != null ? questions.ElementAtOrDefault(4).Text : string.Empty : string.Empty
                    });
                }

                PdfPTable mainTable = PDFUtils.BuildTableBody(headers, rowsData, tableWidths);

                doc.Add(mainTable);

                doc.Close();
                stream.Flush();
                stream.Position = 0;

            }
            catch (Exception ex)
            {
                throw;
            }
           
            return File(stream.GetBuffer(), "application/pdf", "file.pdf");
        }

        //POST: Requests/GetExcelReport
        [HttpPost]
        public FileContentResult GetExcelReport(RequestViewModel model)
        {
            List<RequestViewModel> cast = new List<RequestViewModel>();
            var userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);
            var data = RequestObject.GetListCopy(userId, model);

            if (data.Data != null)
            {
                cast = data.Data.OfType<RequestViewModel>().ToList();

                foreach (var item in cast)
                {
                    var preguntasVM = item.QuestionsVM.ToList();

                    if (preguntasVM != null)
                    {
                       switch (preguntasVM.Count)
                        {
                            case 1:
                                item.Pregunta1 = preguntasVM[0].Text;
                                break;

                            case 2:
                                item.Pregunta1 = preguntasVM[0].Text;
                                item.Pregunta2 = preguntasVM[1].Text;
                                break;

                            case 3:
                                item.Pregunta1 = preguntasVM[0].Text;
                                item.Pregunta2 = preguntasVM[1].Text;
                                item.Pregunta3 = preguntasVM[2].Text;
                                break;

                            case 4:
                                item.Pregunta1 = preguntasVM[0].Text;
                                item.Pregunta2 = preguntasVM[1].Text;
                                item.Pregunta3 = preguntasVM[2].Text;
                                item.Pregunta4 = preguntasVM[3].Text;
                                break;

                            case 5:
                                item.Pregunta1 = preguntasVM[0].Text;
                                item.Pregunta2 = preguntasVM[1].Text;
                                item.Pregunta3 = preguntasVM[2].Text;
                                item.Pregunta4 = preguntasVM[3].Text;
                                item.Pregunta5 = preguntasVM[4].Text;
                                break;
                        }
                    }
                }
            }

            List<string> columns = new List<string>
            {
                "#",
                "USUARIO",
                "SOLICITUD",
                "FECHA",
                "STATUS",
                "PREGUNTA 1",
                "PREGUNTA 2",
                "PREGUNTA 3",
                "PREGUNTA 4",
                "PREGUNTA 5"
            };

            List<int> indices = new List<int> { 0, 9, 10, 11, 12, 13, 14, 15};

            MemoryStream stream = ExcelExport.ExportList(cast, columns, indices);
           
            return File(stream.GetBuffer(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file.xlsx");
        }
    }
}