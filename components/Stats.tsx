import { Users, Calendar, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Stats() {
  //   const Card = ({ children }: any) => (
  //     <div className="bg-white rounded-lg shadow-md border border-gray-200">
  //       {children}
  //     </div>
  //   );

  //   const CardContent = ({ children, className = "" }: any) => (
  //     <div className={className}>{children}</div>
  //   );

  return (
    <>
      <div className="w-full relative">
        {/* Cards di tengah - overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full px-4 py-8 grid grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-sky-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-gray-600">Active Players</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-gray-600">Games This Week</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <MapPin className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-gray-600">Venues Available</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Star className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
