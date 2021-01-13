using BO.BussinesObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace UsersManagement.Controllers
{
    public class LoginController : Controller
    {
        //objetos
        private UserBO UserObject = new UserBO();

        // GET: Login
        public ActionResult Index(string message = "")
        {
            //mensaje de error
            ViewBag.Message = message;
            
            return View();
        }        

        // Post: Authentication
        [HttpPost]
        public ActionResult Authorize(string user, string password)
        {
            var userAuthorized = UserObject.Login(user, password);

            if (userAuthorized != null)
            {
                FormsAuthentication.SetAuthCookie(string.Format("{0}|{1}|{2}", userAuthorized.Nick, userAuthorized.UserId, userAuthorized.Type), true);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Index", new { message = "Usuario o contraseña incorrectos" });
            }          
        }

        [Authorize]
        // GET: Logout
        public ActionResult LogOut(string message = "")
        {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index");
        }       
    }
}
