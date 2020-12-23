using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BO.BussinesObject;
using BO.ViewModel;

namespace UsersManagement.Controllers
{
    public class RequestsController : Controller
    {
        //objetos
        private DepartmentBO DepartmentObject = new DepartmentBO();

        // GET: Requests
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
    }
}