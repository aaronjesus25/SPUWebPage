using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BO.BussinesObject;
using BO.MappingViewModel;
using BO.ViewModel;

namespace UsersManagement.Controllers
{
    [Authorize]
    public class ConceptsController : Controller
    {
        //objetos
        private readonly ConceptBO ConceptObject = new ConceptBO();

        // GET: Concepts
        public ActionResult Index()
        {
            return View();
        }

        //Get: Departments/GetList
        [HttpGet]
        public JsonResult GetList()
        {
            // TODO: Add insert logic here
            var list = ConceptObject.GetList();

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        // POST: Users/Create
        [HttpPost]
        public JsonResult Create(ConceptViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = ConceptObject.Register(model);
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
        public ActionResult Delete(ConceptViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = ConceptObject.Delete(model.ConceptId);
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
        public ActionResult Update(ConceptViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = ConceptObject.Update(model);
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