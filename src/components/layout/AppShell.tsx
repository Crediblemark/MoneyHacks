
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { APP_NAME_KEY, NAV_ITEMS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LogIn, UserCircle } from 'lucide-react'; // Added LogIn, UserCircle
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext'; // Added useAuth
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t, aiName, setAiName } = useLanguage();
  const { currentUser, isLoading: authLoading, signInWithGoogle, signOutUser } = useAuth();

  const renderUserSection = () => {
    if (authLoading) {
      return (
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      );
    }

    if (currentUser) {
      return (
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.photoURL || "https://placehold.co/100x100.png"} alt={currentUser.displayName || t.userAvatarAlt} data-ai-hint="user avatar" />
            <AvatarFallback>
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle size={18} />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden truncate">
            <span className="text-sm font-medium text-sidebar-foreground truncate" title={currentUser.displayName || t.userNamePlaceholder}>
              {currentUser.displayName || t.userNamePlaceholder}
            </span>
            <span className="text-xs text-muted-foreground truncate" title={currentUser.email || t.userEmailPlaceholder}>
              {currentUser.email || t.userEmailPlaceholder}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={signOutUser} className="ml-auto group-data-[collapsible=icon]:hidden text-muted-foreground hover:text-sidebar-foreground" title={t.logoutButtonLabel}>
            <LogOut size={18} />
          </Button>
        </div>
      );
    }

    return (
      <Button onClick={signInWithGoogle} className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square">
        <LogIn size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />
        <span className="group-data-[collapsible=icon]:hidden">{t.authLoginButton}</span>
      </Button>
    );
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-sm">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-3h8v2H8v-2zm4 6h4v2h-4v-2z"/>
            </svg>
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {t[APP_NAME_KEY as keyof typeof t]}
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent asChild>
          <ScrollArea className="h-full">
            <SidebarMenu className="px-2">
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.labelKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: t[item.labelKey as keyof typeof t], className: "bg-sidebar text-sidebar-foreground" }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{t[item.labelKey as keyof typeof t]}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border space-y-4">
          {renderUserSection()}

          {currentUser && (
            <div className="space-y-2 group-data-[collapsible=icon]:hidden">
              <Label htmlFor="ai-name-input" className="text-xs text-muted-foreground">{t.aiNameSettingLabel}</Label>
              <Input 
                id="ai-name-input"
                type="text"
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                placeholder={language === 'id' ? 'Nama AI' : 'AI Name'}
                className="h-8 text-sm bg-input border-border focus:bg-background"
              />
            </div>
          )}
          
          <div className="flex gap-2 group-data-[collapsible=icon]:justify-center">
            <Button 
              variant={language === 'id' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setLanguage('id')}
              className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-2"
            >
              {t.languageSwitcherID}
            </Button>
            <Button 
              variant={language === 'en' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setLanguage('en')}
              className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-2"
            >
              {t.languageSwitcherEN}
            </Button>
          </div>
          
          {/* Notification permission button - kept for consistency */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'default') {
                  Notification.requestPermission().then(permission => {
                    // You might want to update a state here to re-render the button text
                    console.log('Notification permission:', permission);
                  });
                }
              }
            }}
            className="w-full group-data-[collapsible=icon]:hidden"
            disabled={typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'default'}
          >
            {typeof window !== 'undefined' && 'Notification' in window ? 
              (Notification.permission === 'granted' ? t.authNotificationAllowed : 
              Notification.permission === 'denied' ? t.authNotificationBlocked : 
              t.authNotificationRequest) : t.authNotificationRequest}
          </Button>

        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background shadow-sm gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Optional: Breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
