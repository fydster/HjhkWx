using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class _applyRefundOrder
    {
        public string url = "dto/trainOrder/applyRefundOrder";

        /// <summary>
        /// 申请退票
        /// </summary>
        /// <returns></returns>
        public string applyRefundOrder(string orderNo,string passengerId)
        {
            List<train_para> lt = new List<train_para>();
            //添加参数
            train_para t = new train_para
            {
                key = "orderNo",
                value = orderNo
            };
            lt.Add(t);
            t = new train_para
            {
                key = "method",
                value = "applyRefundOrder"
            };
            lt.Add(t);
            t = new train_para
            {
                key = "passengerId",
                value = passengerId
            };
            lt.Add(t);
            train_get tg = new train_get
            {
                url = url,
                para = lt
            };
            string result = new _Train().GetResult(tg, "GET");
            return result;
        }
    }
}
