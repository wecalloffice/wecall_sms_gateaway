'use client';

import { useState, useEffect } from 'react';
import RoutingHeader from '@/components/routing/RoutingHeader';
import RoutingStats from '@/components/routing/RoutingStats';
import RoutingTable from '@/components/routing/RoutingTable';
import { mockRouting } from '@/mocks/adapters/mockRouting';

interface RoutingManagementPageProps {
  role?: 'CLIENT' | 'RESELLER' | 'PLATFORM';
}

export default function RoutingManagementPage({ role = 'PLATFORM' }: RoutingManagementPageProps) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const loadRoutes = async () => {
      try {
        // In a real app, fetch from API based on role
        const [rawRoutes, connectors] = await Promise.all([
          mockRouting.routes(),
          mockRouting.connectors(),
        ]);

        const mappedRoutes = rawRoutes.map((route, idx) => {
          const gateway = connectors.find((c) => c.sid === route.primary_connector_sid)?.name
            ?? route.primary_connector_sid
            ?? 'Unknown connector';

          return {
            id: route.sid ?? idx,
            name: route.name,
            prefix: route.mccmnc?.join(', ') ?? route.country ?? 'N/A',
            gateway,
            priority: idx + 1,
            successRate: 98.0,
            status: route.status,
          };
        });

        setRoutes(mappedRoutes);
      } catch (error) {
        console.error('Error loading routes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const handleAddRoute = () => {
    console.log('Add route clicked');
    // Modal/form would open here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading routing configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoutingHeader />
      <RoutingStats routes={routes} />
      <RoutingTable routes={routes} />
    </div>
  );
}
