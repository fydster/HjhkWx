using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class employee
    {
        public int id { get; set; }
        /// <summary>
        /// 工号？
        /// </summary>
        public int sourceId { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 工号
        /// </summary>
        public string workNo { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public int sex { get; set; }
        /// <summary>
        /// 联系电话
        /// </summary>
        public string tel { get; set; }
        /// <summary>
        /// 微信唯一编号
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime addOn { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int state { get; set; }
        /// <summary>
        /// 后台登陆密码
        /// </summary>
        public string password { get; set; }
        /// <summary>
        /// 是否为工程师
        /// </summary>
        public int isService { get; set; }
        /// <summary>
        /// 工程师级别
        /// </summary>
        public int levelPoint { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string photoUrl { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string memo { get; set; }

        /// <summary>
        /// 菜单权限
        /// </summary>
        public string limits { get; set; }
        public int role { get; set; }
        public int partnerId { get; set; }
    }
}
