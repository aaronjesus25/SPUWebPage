using BO.BussinesObject;
using BO.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UsersManagement.Controllers
{
    [Authorize]
    public class DepartmentsController : Controller
    {
        //objetos
        private DepartmentBO DepartmentObject = new DepartmentBO();

        // GET: Departments
        public ActionResult Index()
        {
            return View();
        }

        //Get: Departments/GetList
        [HttpGet]
        public JsonResult GetList()
        {
            // TODO: Add insert logic here
            var list = DepartmentObject.GetList();

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // POST: Users/Create
        [HttpPost]
        public JsonResult Create(DepartmentViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = DepartmentObject.Register(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Departments/Delete
        [HttpPost]
        public ActionResult Delete(int DepartmentId)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = DepartmentObject.Delete(DepartmentId);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Departments/Update
        [HttpPost]
        public ActionResult Update(DepartmentViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = DepartmentObject.Update(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }
    }
}