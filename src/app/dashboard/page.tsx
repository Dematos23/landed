import Link from "next/link"
import Image from "next/image"
import { PlusCircle, MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sites = [
  {
    id: '1',
    name: "Acme Inc. Launch",
    subdomain: "acme.landed.co",
    image: "https://placehold.co/600x400.png",
    hint: "website screenshot",
    views: "1.2k",
    conversions: "8.5%",
  },
  {
    id: '2',
    name: "Innovate Corp. Waitlist",
    subdomain: "innovate.landed.co",
    image: "https://placehold.co/600x400.png",
    hint: "modern design",
    views: "3.4k",
    conversions: "12.1%",
  },
  {
    id: '3',
    name: "Portfolio Project",
    subdomain: "my-portfolio.landed.co",
    image: "https://placehold.co/600x400.png",
    hint: "abstract portfolio",
    views: "876",
    conversions: "5.2%",
  },
    {
    id: '4',
    name: "Beta Signups",
    subdomain: "beta.landed.co",
    image: "https://placehold.co/600x400.png",
    hint: "tech startup",
    views: "5.6k",
    conversions: "15.7%",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Sites</h2>
          <p className="text-muted-foreground">
            Manage your landing pages here.
          </p>
        </div>
        <Link href="/designer/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Site
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sites.map((site) => (
          <Card key={site.id} className="flex flex-col">
            <CardHeader className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href={`/designer/${site.id}`} className="flex items-center w-full">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Image
                alt="Site preview"
                className="aspect-video w-full rounded-md object-cover"
                data-ai-hint={site.hint}
                height="310"
                src={site.image}
                width="550"
              />
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="text-lg">{site.name}</CardTitle>
              <CardDescription>{site.subdomain}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
              <div>
                <span>{site.views} views</span>
                <span className="mx-2">&#183;</span>
                <span>{site.conversions} conversion</span>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href={`https://${site.subdomain}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
