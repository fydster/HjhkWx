using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class submitOrder
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/submitOrder";
        public string ToSubmitOrder(int orderId,string pay)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "orderId",
                value = orderId.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "pay",
                value = pay,
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "payType",
                value = "1",
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

            string Json = new _Travel().GetJson(lt, null);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}
