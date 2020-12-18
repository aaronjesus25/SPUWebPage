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
    [Authorize]
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

        // GET: Permisos
        public ActionResult Permisos()
        {
            return View();
        }

        // GET: Users/SignIn
        public ActionResult Register()
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

        //Get: Users/GetList
        [HttpGet]
        public JsonResult GetList()
        {
            // TODO: Add insert logic here
            var list = UserObject.GetList();

            return Json(list, JsonRequestBehavior.AllowGet);                      
        }

        // POST: Users/Create
        [HttpPost]
        public JsonResult SignIn(UserViewModel viewModel)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = UserObject.Register(viewModel);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }
            
            return Json(resp, JsonRequestBehavior.AllowGet);          
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

       
        // POST: Users/Delete/5
        [HttpPost]
        public ActionResult Delete(int userId)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = UserObject.Delete(userId);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }

        // POST: Users/Update/
        [HttpPost]
        public ActionResult Update(UserViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = UserObject.Update(model);
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }

            return Json(resp, JsonRequestBehavior.AllowGet);
        }


        // POST: Users/Update/
        [HttpPost]
        public ActionResult UpdatePermisions(UserViewModel model)
        {
            ResponseViewModel resp = new ResponseViewModel();

            try
            {
                resp = UserObject.UpdatePermisions(model);
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
