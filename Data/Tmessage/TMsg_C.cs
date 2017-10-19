using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Tmessage
{
    //原始编号OPENTM204650588--订单消息通知
    public class TMsg_C
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 日期
        /// </summary>
        public MessageValue keyword2 { get; set; }
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
        public TMsg_Work GetMessageBody(string first, string keyword1, string keyword2, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",消息类型:" + keyword1);
            sb.Append(",跟进日期:" + keyword2);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Work s = new TMsg_Work
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
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
            return "eMO-VgoC03eAbtiovH4K5PRs0zekHNDM1sJv27YLMSc";
        }
    }
}
