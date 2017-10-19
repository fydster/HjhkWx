using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class productInfo
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/detail";
        public string GetProductInfo(int productId)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "productId",
                value = productId.ToString(),
                vType = 0
            };
            lt.Add(tp);

            string Json = new _Travel().GetJson(lt,null);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}
