import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Label } from "@/components/ui/8bit/label";
import { Input } from "@/components/ui/8bit/input";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/8bit/input-otp";
import { Button } from "@/components/ui/8bit/button";

export default function RoomForm() {
    return (
        <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl"> Create a room </CardTitle>
                        <CardDescription className="text-xs">
                            Enter your username below to create a room.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="flex flex-col items-start gap-2">
                                Username
                                <Input placeholder="Player 1" className="w-full" required />
                            </Label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={() => window.location.assign("/room")}>
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="join">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Join a room</CardTitle>
                        <CardDescription className="text-xs">
                            Enter your username and the room code below to join a room.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="flex flex-col items-start gap-2">
                                Username
                                <Input placeholder="Player 1" className="w-full" required />
                            </Label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="flex flex-col items-start gap-2">
                                Room code
                                <InputOTP maxLength={4}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </Label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={() => window.location.assign("/room")}>
                            Join
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
