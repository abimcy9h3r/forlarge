"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, Bell, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    website: "",
    wallet_address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setProfile(profile);
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        website: profile.website || "",
        wallet_address: profile.wallet_address || "",
      });
    }
    setLoading(false);
  }

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        website: formData.website,
      })
      .eq('id', user.id);

    if (!error) {
      alert('Profile updated successfully!');
      loadProfile();
    } else {
      alert('Error updating profile: ' + error.message);
    }
    setSaving(false);
  }

  async function handleSaveWallet() {
    setSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        wallet_address: formData.wallet_address,
      })
      .eq('id', user.id);

    if (!error) {
      alert('Wallet updated successfully!');
      loadProfile();
    } else {
      alert('Error updating wallet: ' + error.message);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Update your profile information and how others see you on forlarge
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="johndoe"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your unique store URL: forlarge.app/store/{formData.username || 'username'}
                  </p>
                </div>

                {formData.username && (
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4">
                    <Label className="text-sm font-medium mb-2 block">Your Store Link</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={`${typeof window !== 'undefined' ? window.location.origin : 'https://forlarge.app'}/store/${formData.username}`}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : 'https://forlarge.app'}/store/${formData.username}`);
                          alert('Store link copied to clipboard!');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email} disabled className="bg-accent" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Wallet & Payouts</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Connect your crypto wallet to receive payments on-chain
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet_address">Wallet Address</Label>
                  <Input
                    id="wallet_address"
                    value={formData.wallet_address}
                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                    placeholder="0x..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your Ethereum wallet address to receive payments
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-accent p-4">
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Payments are processed on-chain via smart contracts</p>
                    <p>• You receive 95% of each sale (5% platform fee)</p>
                    <p>• Instant settlement to your wallet</p>
                    <p>• No withdrawal limits or delays</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveWallet} 
                disabled={saving}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {saving ? "Saving..." : "Save Wallet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose what notifications you want to receive
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-semibold">New Sales</h3>
                    <p className="text-sm text-muted-foreground">Get notified when someone purchases your product</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-semibold">Product Views</h3>
                    <p className="text-sm text-muted-foreground">Daily summary of product views</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-semibold">Marketing Updates</h3>
                    <p className="text-sm text-muted-foreground">Tips and updates from forlarge</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>

              <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your account security and authentication
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last changed: Never
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/5">
                  <h3 className="font-semibold mb-2 text-red-500">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all data
                  </p>
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
