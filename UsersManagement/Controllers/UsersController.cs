using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Services;
using BO.BussinesObject;
using BO.MappingViewModel;
using BO.ViewModel;

namespace UsersManagement.Controllers
{
    public class UsersController : Controller
    {
        //objetos
        private UserBO UserObject = new UserBO();
        private readonly UserMap UserMap = new UserMap();

        // GET: Users
        public ActionResult Index()
        {
            return View();
        }

        // GET: Users/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Users/Create
        public ActionResult Create()
        {
            return View();
        }

        //servicio solicitud lista de datos
        [HttpGet]
        public JsonResult GetList()
        {
            // TODO: Add insert logic here
            var list = UserObject.GetList();

            return Json(list, JsonRequestBehavior.AllowGet);
                       
        }

        // POST: Users/Create
        [HttpPost]
        public JsonResult Create(UserViewModel viewModel)
        {          
            // TODO: Add insert logic here
            var respuesta = UserObject.Register(viewModel);
            return Json(respuesta, JsonRequestBehavior.AllowGet);           
        }

        // GET: Users/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Users/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Users/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Users/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
