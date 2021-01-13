using BO.BussinesObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace UsersManagement.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        //objetos
        private UserBO UserObject = new UserBO();

        public ActionResult Index()
        {
            int userId = 0;

            //valida el usuario
            if (User.Identity.Name != null)
            {
                //obtiene el usuario logueado 
                userId = Convert.ToInt32(User.Identity.Name.Split('|')[1]);                
                var user = UserObject.GetById(userId);
                ViewBag.UserId = userId;
                ViewBag.UserType = user.Type;

                //acceso a la vista principal por tipo y rol de usuario
                if (user.Type == 1)
                {
                    //Administrador 
                    return View();
                }
                else if (user.Boss)
                {
                    //vista jefes 
                    return View("Jefe");
                }
                else if (user.Petitioner)
                {
                    //vista solicitantes 
                    return View("Solicitante");
                }
                else if (user.Authorizing)
                {
                    //vista autorizador 
                    return View("Autorizador");
                }
                else if (user.Copy)
                {
                    //vista copia
                    return View("Copia");
                }
            }

            /*
             * si el usuario no tiene ningun rol 
             * lo saca de la sesion 
             */
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }        
    }
}