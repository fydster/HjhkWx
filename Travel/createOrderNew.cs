using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class createOrderNew
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/createOrderNew";
        public string CreateOrder(string sourceOrderId, int productId, string startTime, int bookNumber, string contactName, string contactTel)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "sourceOrderId",
                value = sourceOrderId,
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "productId",
                value = productId.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "startTime",
                value = startTime.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "bookNumber",
                value = bookNumber.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "acctId",
                value = _Travel.acctId.ToString(),
                vType = 0
            };
            lt.Add(tp);

            List<travel_para_data> dl = new List<travel_para_data>();
            travel_para_data dt = new travel_para_data();
            dt.key = "contact";
            List<travel_para> dts = new List<travel_para>();
            tp = new travel_para
            {
                key = "contactName",
                value = contactName,
                vType = 1
            };
            dts.Add(tp);

            tp = new travel_para
            {
                key = "contactTel",
                value = contactTel,
                vType = 0
            };
            dts.Add(tp);
            dt.lt = dts;

            dl.Add(dt);

            string Json = new _Travel().GetJson(lt,dl);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}
