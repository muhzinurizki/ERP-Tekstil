import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Boxes,
    Factory,
    ShoppingCart,
    Wallet,
    Users,
    TagIcon,
    Truck,
    Building2,
} from "lucide-react";

const sidebarSections = [
    {
        title: "Main",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                roles: ["admin", "manager", "staff"],
            },
        ],
    },
    {
        title: "Master Data",
        items: [
            {
                label: "Warehouse",
                href: "/master/warehouses",
                icon: Boxes,
                roles: ["admin"],
            },
            {
                label: "Material Category",
                href: "/master/material-categories",
                icon: TagIcon,
                roles: ["admin", "manager"],
            },
            {
                label: "Raw Material",
                href: "/master/raw-materials",
                icon: Boxes,
                roles: ["admin"],
            },
            {
                label: "Unit of Measure",
                href: "/master/units",
                icon: TagIcon,
                roles: ["admin", "manager"],
            },
            {
                label: "Supplier",
                href: "/master/suppliers",
                icon: Truck,
                roles: ["admin", "manager"],
            },
            {
                label: "Customer",
                href: "/master/customers",
                icon: Building2, // lucide-react
                roles: ["admin", "manager"],
            },
        ],
    },
    {
        title: "Operasional",
        items: [
            {
                label: "Purchase Request",
                href: "/purchasing/purchase-requests",
                icon: ShoppingCart,
                roles: ["admin", "staff"],
            },
        ],
    },
    {
        title: "Inventory",
        items: [
            {
                label: "Stock Overview",
                href: "/inventory/stocks",
                icon: Boxes,
                roles: ["admin", "manager", "staff"],
            },
            {
                label: "Stock Adjustment",
                href: "/inventory/stocks/adjust",
                icon: Boxes,
                roles: ["admin", "staff"],
            },
            {
                label: "Stock Movement",
                href: "/inventory/stocks/history",
                icon: Boxes,
                roles: ["admin", "manager", "staff"],
            },
        ],
    },
    {
        title: "Purchasing",
        items: [
            {
                label: "Purchase Orders",
                href: "/purchasing/purchase-orders",
                icon: ShoppingCart,
                roles: ["admin", "manager"],
            },
            {
                label: "Purchase Requests",
                href: "/purchasing/purchase-requests",
                icon: ShoppingCart,
                roles: ["admin", "staff"],
            },
        ],
    },
    {
        title: "Administration",
        items: [
            {
                label: "User Management",
                href: "/users",
                icon: Users,
                roles: ["admin"],
            },
        ],
    },
];

export default function Sidebar() {
    const { url, props } = usePage();
    const role = props.auth?.role?.toLowerCase() ?? "staff";

    return (
        <aside
            className="
      w-64 min-h-screen
      bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950
      text-slate-200
      flex flex-col
      shadow-lg
    "
        >
            {/* BRAND */}
            <div className="h-16 px-6 flex items-center border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Factory className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">
                            ERP TEXTILE
                        </span>
                        <h1 className="text-lg font-bold text-white tracking-wide">
                            Sistem
                        </h1>
                    </div>
                </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
                {sidebarSections.map((section) => {
                    const visibleItems = section.items.filter((item) =>
                        item.roles.includes(role)
                    );

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={section.title}>
                            {/* SECTION TITLE */}
                            <div className="px-3 mb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                {section.title}
                            </div>

                            {/* ITEMS */}
                            <div className="space-y-1">
                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = url.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`
                        group relative flex items-center gap-3
                        px-4 py-2.5 rounded-lg text-sm
                        transition-all duration-200
                        ${
                            active
                                ? "bg-indigo-600/20 text-white shadow-sm"
                                : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }
                      `}
                                        >
                                            <div
                                                className={`
                          flex items-center justify-center
                          w-8 h-8 rounded-lg
                          ${
                              active
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-700/50 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300"
                          }
                        `}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            <span
                                                className={`${
                                                    active
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {item.label}
                                            </span>

                                            {active && (
                                                <span
                                                    className="
                          absolute left-0 top-0 bottom-0
                          w-1 rounded-r-lg bg-indigo-500
                        "
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 leading-relaxed">
                    PT. Indotaichen Textile Industry
                </p>
                <p className="text-xs text-slate-600 mt-1">
                    v1.0.0 · ERP System
                </p>
            </div>
        </aside>
    );
}
