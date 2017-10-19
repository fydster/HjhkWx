using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Tmessage
{
    //OPENTM202119869 预订成功通知
    public class TMsg_Order
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 航程信息
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 航班日期
        /// </summary>
        public MessageValue keyword2 { get; set; }
        /// <summary>
        /// 订单总价
        /// </summary>
        public MessageValue keyword3 { get; set; }
        /// <summary>
        /// 乘客信息
        /// </summary>
        public MessageValue keyword4 { get; set; }
        /// <summary>
        /// 后缀
        /// </summary>
        public MessageValue remark { get; set; }

        /// <summary>
        /// 获取模板消息体
        /// </summary>
        /// <param name="first"></param>
        /// <param name="keyword1"></param>
        /// <param name="keyword2"></param>
        /// <param name="keyword3"></param>
        /// <param name="keyword4"></param>
        /// <param name="remark"></param>
        /// <returns></returns>
        public TMsg_Order GetMessageBody(string first, string keyword1, string keyword2, string keyword3,string keyword4, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",航程信息:" + keyword1);
            sb.Append(",航班日期:" + keyword2);
            sb.Append(",订单总价:" + keyword3);
            sb.Append(",乘客信息:" + keyword4);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Order s = new TMsg_Order
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
                keyword3 = new MessageValue { value = keyword3, color = "" },
                keyword4 = new MessageValue { value = keyword4, color = "" },
                remark = new MessageValue { value = remark, color = "#428bca" }
            };
            return s;
        }

        /// <summary>
        /// 模板消息ID
        /// </summary>
        /// <returns></returns>
        public string Key()
        {
            return "wWTWOfU5Qj_mWFAbZNs66oeaX_PqLjbyEPJb666JvvA";
        }
    }
}
