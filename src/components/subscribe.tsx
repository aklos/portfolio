import { FiMail } from "react-icons/fi";
import { SUBSTACK_URL } from "@/lib/site";

/* Bit Rot's teal action, with the cover's specks */
export function SubscribeButton() {
    return (
        <a href={`${SUBSTACK_URL}/subscribe`} className="btn btn-accent shrink-0">
            Subscribe
        </a>
    );
}

/* End-of-post call to action: the Substack is Bit Rot's mailing list */
export default function Subscribe() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-md bg-mist p-6">
            <div className="flex items-center gap-4">
                <span className="grid place-items-center size-9 rounded-md bg-teal text-white text-base shrink-0">
                    <FiMail />
                </span>
                <div>
                    <p className="font-semibold tracking-tight">
                        Get Bit Rot by email
                    </p>
                    <p className="text-sm text-muted mt-0.5">
                        New essays when they&apos;re ready. Free, via Substack.
                    </p>
                </div>
            </div>
            <SubscribeButton />
        </div>
    );
}
