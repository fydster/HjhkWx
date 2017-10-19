using com.seascape.db;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data
{
    public abstract class DbCenter
    {
        public DbHelper helper { 
            get { return DataConnectionManager.GetHelper(); } 
        }
    }
}
