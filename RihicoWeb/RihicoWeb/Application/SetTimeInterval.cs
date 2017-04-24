using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RihicoWeb.Application
{
    public class SetTimeInterval
    {
        private System.Timers.Timer planTimer;
        private Action planAction;
        bool isRepeatedPlan;

        private SetTimeInterval(int millisecondsDelay, Action planAction, bool isRepeatedPlan)
        {
            planTimer = new System.Timers.Timer(millisecondsDelay);
            planTimer.Elapsed += GenericTimerCallback;
            planTimer.Enabled = true;

            this.planAction = planAction;
            this.isRepeatedPlan = isRepeatedPlan;
        }

        public static SetTimeInterval Delay(int millisecondsDelay, Action planAction)
        {
            return new SetTimeInterval(millisecondsDelay, planAction, false);
        }

        public static SetTimeInterval Repeat(int millisecondsInterval, Action planAction)
        {
            return new SetTimeInterval(millisecondsInterval, planAction, true);
        }

        private void GenericTimerCallback(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (!isRepeatedPlan)
            {
                Abort();
            }
            planAction();
        }

        public void Abort()
        {
            planTimer.Enabled = false;
            planTimer.Elapsed -= GenericTimerCallback;
        }

        public void Dispose()
        {
            if (planTimer != null)
            {
                Abort();
                planTimer.Dispose();
                planTimer = null;
            }
            else
            {
                throw new ObjectDisposedException(typeof(SetTimeInterval).Name);
            }
        }
    }
}