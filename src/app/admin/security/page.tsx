import { prisma } from "@/lib/prisma";
import { Shield, ShieldAlert, ShieldCheck, Activity, Terminal, AlertTriangle, Bug } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function SecurityDashboard() {
  const events = await prisma.securityEvent.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50
  });

  const criticalCount = events.filter(e => e.severity === 'CRITICAL').length;
  const highCount = events.filter(e => e.severity === 'HIGH').length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight">Cybersecurity Simulation Console</h1>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-8 text-sm text-destructive flex items-center gap-2 font-medium">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <p>This is a sandboxed simulation environment. No actual exploits or persistent threats are executing. All events below are synthetic payloads routed through the event abstraction layer.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">Total Events (24h)</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{events.length}</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-card border border-destructive/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-destructive">Critical Threats</h3>
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-orange-500/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-orange-500">High Risk</h3>
            <Bug className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-500">{highCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">System Status</h3>
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-lg font-bold text-green-500">MONITORING ACTIVE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5" /> Event Stream
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Timestamp</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Event Type</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono">
                        No security events logged in the current timeframe.
                      </td>
                    </tr>
                  ) : (
                    events.map(event => (
                      <tr key={event.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider ${
                            event.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' :
                            event.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                            event.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-xs">
                          {event.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {event.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.status === 'MITIGATED' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                            event.status === 'INVESTIGATING' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            'bg-secondary text-foreground'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold tracking-tight mb-6">Attack Chain Visualization</h2>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              {events.slice(0, 4).map((event, i) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-background bg-secondary text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className={`w-2 h-2 rounded-full ${event.severity === 'CRITICAL' || event.severity === 'HIGH' ? 'bg-destructive' : 'bg-primary'}`}></div>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-border bg-background shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-xs font-mono">{event.type}</div>
                    </div>
                    <div className="text-muted-foreground text-xs">{event.source}</div>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
